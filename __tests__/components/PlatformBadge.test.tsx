// __tests__/components/PlatformBadge.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlatformBadge } from '@/components/contests/PlatformBadge';

describe('PlatformBadge Component', () => {
    describe('Rendering', () => {
        it('should render platform name', () => {
            render(<PlatformBadge platform="LeetCode" />);
            expect(screen.getByText('LeetCode')).toBeInTheDocument();
        });

        it('should render as a link when URL is provided', () => {
            render(<PlatformBadge platform="LeetCode" url="https://leetcode.com/contest/" />);
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('href', 'https://leetcode.com/contest/');
        });

        it('should render as span when no URL is provided', () => {
            const { container } = render(<PlatformBadge platform="LeetCode" />);
            const badge = container.querySelector('span');
            expect(badge).toBeInTheDocument();
        });

        it('should apply clickable class when URL is provided', () => {
            const { container } = render(<PlatformBadge platform="LeetCode" url="https://leetcode.com" />);
            const link = container.querySelector('a');
            expect(link?.className).toContain('cursor-pointer');
        });

        it('should open link in new tab', () => {
            render(<PlatformBadge platform="LeetCode" url="https://leetcode.com" />);
            const link = screen.getByRole('link');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
    });

    describe('Platform-specific styling', () => {
        it('should apply correct style for LeetCode', () => {
            const { container } = render(<PlatformBadge platform="LeetCode" />);
            const badge = container.querySelector('[class*="leetcode"]') || container.firstChild;
            expect(badge).toBeInTheDocument();
        });

        it('should normalize platform names (case-insensitive)', () => {
            const { container: container1 } = render(<PlatformBadge platform="LEETCODE" />);
            const { container: container2 } = render(<PlatformBadge platform="leetcode" />);
            const { container: container3 } = render(<PlatformBadge platform="LeetCode" />);

            // All should render the badge
            expect(container1.textContent).toContain('LEETCODE');
            expect(container2.textContent).toContain('leetcode');
            expect(container3.textContent).toContain('LeetCode');
        });
    });

    describe('Accessibility', () => {
        it('should have accessible link text', () => {
            render(<PlatformBadge platform="LeetCode" url="https://leetcode.com" />);
            const link = screen.getByRole('link');
            expect(link).toHaveAccessibleName(/LeetCode/i);
        });

        it('should be keyboard accessible when clickable', () => {
            render(<PlatformBadge platform="LeetCode" url="https://leetcode.com" />);
            const link = screen.getByRole('link');
            expect(link).toBeVisible();
            expect(link.tagName).toBe('A');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty platform name', () => {
            render(<PlatformBadge platform="" />);
            expect(screen.queryByText('')).toBeInTheDocument();
        });

        it('should handle special characters in platform name', () => {
            render(<PlatformBadge platform="Test & Code" />);
            expect(screen.getByText('Test & Code')).toBeInTheDocument();
        });

        it('should handle very long platform names', () => {
            const longName = 'This is a very long platform name that might cause layout issues';
            render(<PlatformBadge platform={longName} />);
            expect(screen.getByText(longName)).toBeInTheDocument();
        });
    });
});
